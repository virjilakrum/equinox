use anchor_lang::prelude::*;

declare_id!("4V7bQi7Fus5Mj4Hr5sXtMjoBmZu5kQnFGvuLBhEPVpDh");

#[program]
pub mod equinox {
    use super::*;

    pub fn create_market(
        ctx: Context<CreateMarket>,
        paper_id: String,
        question: String,
        resolution_date: i64,
        initial_stake: u64,
    ) -> Result<()> {
        require!(
            paper_id.len() <= 50,
            CustomError::PaperIdTooLong
        );
        require!(
            question.len() <= 200,
            CustomError::QuestionTooLong
        );
        require!(
            resolution_date > Clock::get()?.unix_timestamp,
            CustomError::InvalidResolutionDate
        );

        let market = &mut ctx.accounts.market;
        market.owner = ctx.accounts.user.key();
        market.paper_id = paper_id;
        market.question = question;
        market.resolution_date = resolution_date;
        market.initial_stake = initial_stake;
        market.validation_count = 0;
        market.total_stake = 0;

        Ok(())
    }

    pub fn validate_paper(
        ctx: Context<ValidatePaper>,
        is_valid: bool,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        market.validation_count += 1;
        market.total_stake += ctx.accounts.user.lamports();

        emit!(ValidationEvent {
            market: ctx.accounts.market.key(),
            validator: ctx.accounts.user.key(),
            is_valid,
            timestamp: Clock::get()?.unix_timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateMarket<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 4 + 50 + 4 + 200 + 8 + 8 + 8 + 8
    )]
    pub market: Account<'info, Market>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ValidatePaper<'info> {
    #[account(mut)]
    pub user: Signer<'info>,
    #[account(mut)]
    pub market: Account<'info, Market>,
}

#[account]
pub struct Market {
    pub owner: Pubkey,
    pub paper_id: String,
    pub question: String,
    pub resolution_date: i64,
    pub initial_stake: u64,
    pub validation_count: u64,
    pub total_stake: u64,
}

#[event]
pub struct ValidationEvent {
    pub market: Pubkey,
    pub validator: Pubkey,
    pub is_valid: bool,
    pub timestamp: i64,
}

#[error_code]
pub enum CustomError {
    #[msg("Paper ID is too long")]
    PaperIdTooLong,
    #[msg("Question is too long")]
    QuestionTooLong,
    #[msg("Resolution date is invalid")]
    InvalidResolutionDate,
    #[msg("Insufficient stake amount")]
    InsufficientStake,
}