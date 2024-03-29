import React, { useState, useEffect } from 'react';
import axios from '../requester';
import { Link, withRouter } from 'react-router-dom';
import converter from 'number-to-words';
import PlayersTable from '../components/PlayersTable';
import Grid, { GridSpacing } from '@material-ui/core/Grid';
import SimpleTable from '../components/SimpleTable';

function TeamDetails(props) {
  const { match } = props;
  const [team, setTeam] = useState(null);
  useEffect(() => {
    fetchTeam(match.params.name);
  }, []);

  async function fetchTeam(name) {
    try {
      const res = await axios.get(`/api/teams/${name}`);
      setTeam(res.data);
    } catch (error) {
      console.log(error);
    }
  }

  if (team === null) return null;
  return (
    <Grid container spacing={2}>
      <Grid item xs={9}>
        <PlayersTable
          title='Forwards'
          players={team.players.filter(
            (player) =>
              player.status === 'NHL' &&
              player.contract_type === 'signed' &&
              player.position.match(/^C|^LW|^RW/)
          )}
        />
        <PlayersTable
          title='Defense'
          players={team.players.filter(
            (player) =>
              player.status === 'NHL' &&
              player.contract_type === 'signed' &&
              player.position.match(/^LD|^RD/)
          )}
        />
        <PlayersTable
          title='Goaltenders'
          players={team.players.filter(
            (player) =>
              player.status === 'NHL' &&
              player.contract_type === 'signed' &&
              player.position.match(/^G/)
          )}
        />
        {/* retained */}
        <PlayersTable
          title='Retained'
          players={team.players.filter(
            (player) => player.status === 'Retained'
          )}
        />
        <PlayersTable
          title='Buyouts'
          players={team.players.filter((player) => player.status === 'Buyout')}
        />
        <PlayersTable
          title='Waivers'
          players={team.players.filter((player) => player.status === 'Waivers')}
        />
        <PlayersTable
          title='In The System'
          players={team.players.filter(
            (player) =>
              player.status === 'Minors' && player.contract_type === 'signed'
          )}
        />
      </Grid>
      <Grid item xs={3}>
        <SimpleTable title='General Manager' rows={[team.gmName]} />
        <SimpleTable title='Total Cap Hit' rows={[team.capHit]} />
        <SimpleTable title='Cap Space' rows={[team.capSpace]} />
        <SimpleTable title='Salary Retained' rows={[team.retained]} />
        <SimpleTable title='Buyouts' rows={[team.buyout]} />
        <SimpleTable title='Average Age' rows={[team.averageAge]} />
        <SimpleTable
          title='Drafts'
          rows={team.draftPicks.map(
            ({ id, season, round, original_team_name }) =>
              `${season} ${original_team_name} ${converter.toOrdinal(round)}`
          )}
        />
      </Grid>
    </Grid>
  );
}

export default withRouter(TeamDetails);
